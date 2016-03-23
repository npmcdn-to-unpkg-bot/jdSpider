# -*- coding: utf-8 -*-
import scrapy
import redis
from jdSpider import redis_pool


class ProductSpider(scrapy.Spider):
    name = "productId"
    allowed_domains = ["jd.com"]
    start_urls = []
    base_url = 'http://item.jd.com/%s.html'
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

    def start_requests(self):
        first = self.get_skuid()
        return [scrapy.Request(self.base_url % first, callback=self.parse, meta={'skuid': first})]

    def parse(self, response):
        pass

    def get_skuid(self, count=None):
        return self.r.srandmember(self.name + ':queue', count)
