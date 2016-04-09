# -*- coding: utf-8 -*-
import scrapy
import redis
import simplejson as json
from jdSpider import redis_pool
from jdSpider.items import ProductInfoItem
from jdSpider import pipelines


class ProductSpider(scrapy.Spider):
    name = "productId"
    allowed_domains = ["jd.com"]
    start_urls = []
    base_url = 'http://item.jd.com/%s.html'
    price_url = 'http://pm.3.cn/prices/pcpmgets?skuids=%s&origin=2'
    r = redis.Redis(connection_pool=redis_pool)
    custom_settings = {
        'HOST': 'item.jd.com',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko)' +
                      'Chrome/45.0.2454.101 Safari/537.36'
    }
    # pipeline = set([pipelines.MongoPipeline])

    def start_requests(self):
        id_length = self.r.scard(self.name + ':queue')
        count = 1
        print id_length
        while count <= id_length:
            count += 1
            product_id = self.get_skuid()
            yield scrapy.Request(self.base_url % product_id, callback=self.parse, meta={'skuid': product_id})

    def parse(self, response):
        skuid = response.request.meta['skuid']
        info_object = {}
        key_array = []
        value_array = []
        for info in response.xpath('//*[@id="product-detail-2"]/table/tr'):
            key = info.xpath('td[@class]/text()').extract()
            value = info.xpath('td[not(@class)]/text()').extract()
            if not key or not value:
                pass
            else:
                key_array.append(key[0])
                value_array.append(value[0])
        for i, value in enumerate(key_array):
            if key_array[i] == "USB2.0":
                key_array[i] = "USB2"
            elif key_array[i] == "USB3.0":
                key_array[i] = "USB3"
            info_object[key_array[i]] = value_array[i]

        yield ProductInfoItem(product_info=info_object, product_id=skuid)

    def next_requests(self):
        nextId = self.get_skuid()
        return [scrapy.Request(self.base_url % nextId, callback=self.parse, meta={'skuid': nextId})]

    def get_skuid(self):
        return self.r.spop(self.name + ':queue')
