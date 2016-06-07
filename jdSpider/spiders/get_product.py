# -*- coding: utf-8 -*-
import scrapy
import redis
import json
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
    pipeline = set([pipelines.MongoPipeline])

    def __init__(self, collection_name='jdProductInfo', set_name='', *args, **kwargs):
        self.collection_name = collection_name
        self.set_name = set_name
        super(ProductSpider, self).__init__(*args, **kwargs)

    def start_requests(self):
        id_length = self.r.scard(self.name + self.set_name + ':queue')
        count = 1
        print id_length
        while count <= id_length:
            count += 1
            product_id = self.get_skuid()
            yield scrapy.Request(self.price_url % product_id, callback=self.get_price, meta={'skuid': product_id})

    def parse(self, response):
        skuid = response.request.meta['skuid']
        m_price = response.request.meta['m_price']
        pc_price = response.request.meta['pc_price']
        info_object = {}
        key_array = []
        value_array = []
        product_name = response.xpath('//*[@id="name"]/h1/text()').extract()
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
        info_object["product_id"] = skuid
        if m_price != 0:
            info_object["m_price"] = m_price
        info_object["pc_price"] = pc_price
        info_object["product_name"] = product_name
        yield ProductInfoItem(product_info=info_object)

    def get_price(self, response):
        skuid = response.request.meta['skuid']
        pc_price = 0
        m_price = 0
        pcp = 0
        body = response.body
        if body:
            j = json.loads(body)
            try:
                p = j[0]["p"]
                pcp = j[0]["pcp"]
                m = j[0]["m"]
            except Exception, e:
                print e
            if pcp != 0:
                pc_price = pcp
                m_price = p
            else:
                if p:
                    pc_price = p
                else:
                    pc_price = m
        else:
            print "error"
        print "pc_price %s" % pc_price
        print "m_price %s" % m_price
        yield scrapy.Request(self.base_url % skuid, callback=self.parse, meta={'skuid': skuid,
                                                                               'pc_price': pc_price,
                                                                               'm_price': m_price
                                                                               })

    def next_requests(self):
        next_id = self.get_skuid()
        return [scrapy.Request(self.base_url % next_id, callback=self.parse, meta={'skuid': next_id})]

    def get_skuid(self):
        return self.r.spop(self.name + self.set_name + ':queue')
