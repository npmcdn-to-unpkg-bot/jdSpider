# -*- coding: utf-8 -*-
import scrapy
import redis
from jdSpider import redis_pool
from jdSpider.items import CommentsItem
from jdSpider import pipelines
from scrapy.utils.response import open_in_browser
import json
import time
from scrapy.exceptions import CloseSpider


class CommentSpider(scrapy.Spider):
    name = "commentsId"
    allowed_domains = ["jd.com"]
    start_urls = []
    base_url = 'http://club.jd.com/productpage/p-%s-s-0-t-3-p-%s.html'
    another_url = 'http://s.club.jd.com/productpage/p-%s-s-0-t-3-p-%s.html'
    r = redis.Redis(connection_pool=redis_pool)
    failList = []
    is_end = False
    max_page = {}
    success_count = {}
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
        url_type = response.request.meta['url_type']
        product_id = response.request.meta['product_id']
        body = response.body.decode("gbk")
        if not body:
            if page not in self.failList:
                    self.failList.append(page)
            if url_type == 0:
                yield scrapy.Request(self.another_url % (product_id, page), callback=self.parse,
                                 meta={'page': page, 'url_type': 1, 'product_id': product_id}, dont_filter=True)
            else:
                yield scrapy.Request(self.base_url % (product_id, page), callback=self.parse,
                                 meta={'page': page, 'url_type': 0, 'product_id': product_id}, dont_filter=True)
        else:
            try:
                body_json = json.loads(body)
            except Exception, e:
                print e
            if page in self.failList:
                self.failList.remove(page)
            self.success_count[product_id] += 1
            body_comments = body_json["comments"]
            comment_length = len(body_comments)
            i = 0
            while i < comment_length:
                # print body_comments[i]
                yield CommentsItem(comments=body_comments[i], product_id=product_id)
                i += 1
            print 'product %d success %d' % (product_id, self.success_count[product_id])
            # single produce comments storage
            # while i
        print 'fail count %d' % len(self.failList)
        if self.success_count[product_id] == (self.max_page[product_id] - 1):
            print "success!!!!!!"

    def get_max_pages(self, response):
        product_id = response.request.meta['product_id']
        r = response.body.decode("gbk")
        if r:
            j = json.loads(r)
            if j["productCommentSummary"]:
                comments_sum = j["productCommentSummary"]["commentCount"]
                self.max_page[product_id] = int(comments_sum / 10) + 1
        current_page = 0
        self.success_count[product_id] = 0
        while current_page < self.max_page[product_id]:
            current_page += 1
            yield scrapy.Request(self.base_url % (product_id, current_page - 1),
                                 callback=self.parse, meta={'page': current_page - 1,
                                                            'url_type': 0,
                                                            'product_id': product_id})

    def fail_list_retry(self):
        product_id = 1956794
        while not len(self.failList) == 0:
            error_page = self.failList.pop()
            yield scrapy.Request(self.another_url % (product_id, error_page), callback=self.parse,
                                 meta={'page': error_page})

    def get_skuid(self):
        pass

