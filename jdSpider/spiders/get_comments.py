# -*- coding: utf-8 -*-
import scrapy
import redis
from jdSpider import redis_pool
from jdSpider.items import ProductInfoItem
from jdSpider import pipelines
import json
import time


class CommentSpider(scrapy.Spider):
    name = "commentsId"
    allowed_domains = ["jd.com"]
    start_urls = []
    base_url = 'http://club.jd.com/productpage/p-%s-s-0-t-3-p-%s.html'
    another_url = 'http://s.club.jd.com/productpage/p-1956794-s-0-t-3-p-1023.html'
    r = redis.Redis(connection_pool=redis_pool)
    failList = []
    is_end = False
    max_page = 0
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
        product_id = 1956794
        page_number = 0
        return [scrapy.Request(self.base_url % (product_id, page_number),
                               callback=self.get_max_pages, meta={'product_id': product_id})]

    def parse(self, response):
        # time.sleep(1)
        page = response.request.meta['page']
        r = response.body.decode("gbk")
        if not r:
            self.failList.append(page)
            # print self.failList
            print len(self.failList)
        else:
            # print r
            j = json.loads(r)
            if not j["comments"]:
                self.is_end = True
                self.fail_list_retry()
                print "end"
            else:
                print j["comments"]

    def get_max_pages(self, response):
        product_id = response.request.meta['product_id']
        r = response.body.decode("gbk")
        if r:
            j = json.loads(r)
            if j["productCommentSummary"]:
                comments_sum = j["productCommentSummary"]["commentCount"]
                self.max_page = int(comments_sum / 10) + 1
        current_page = 0
        while current_page < self.max_page:
            current_page += 1
            yield scrapy.Request(self.base_url % (product_id, current_page - 1),
                                 callback=self.parse, meta={'page': current_page - 1})
        self.fail_list_retry()

    def fail_list_retry(self):
        product_id = 1956794
        while not len(self.failList) == 0:
            error_page = self.failList.pop()
            yield scrapy.Request(self.another_url % (product_id, error_page), callback=self.parse,
                                 meta={'page': error_page})




    def get_skuid(self):
        # return self.r.spop(self.name + ':queue')
        pass