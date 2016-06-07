# -*- coding: utf-8 -*-
import re
import scrapy
from jdSpider.items import SkuIdItem
from jdSpider import pipelines


class SkuidListSpider(scrapy.Spider):
    name = "skuid_list"
    allowed_domains = ["jd.com"]
    base_url = 'http://list.jd.com/list.html?cat=%s'
    page = '&page=%d'
    p = re.compile(ur'fp-text.+?<i>(\d+)</i>', re.MULTILINE | re.IGNORECASE)
    sku_re = re.compile(r'data-sku="(\d+)"', re.MULTILINE | re.IGNORECASE)
    pipeline = set([pipelines.SkuidRedisPipeline])

    def __init__(self, set_name='', collection_name='empty', cid='670,671,672', *args, **kwargs):
        self.set_name = set_name
        self.collection_name = collection_name
        super(SkuidListSpider, self).__init__(*args, **kwargs)
        self.cid = cid
        self.start_urls = []
        self.max_page = None

    def start_requests(self):
        print('Into start requests...')
        return [scrapy.Request(self.base_url % self.cid,
                               callback=self.get_max_pages)]

    def get_max_pages(self, response):
        self.logger.info('get max pages: %s. CID: %s', response.url, self.cid)
        self.max_page = int(self.p.search(response.body).group(1))
        yield scrapy.Request(response.url, callback=self.parse)
        for i in range(1, self.max_page + 1):
            yield scrapy.Request(response.url + (self.page % i))

    def parse(self, response):
        self.logger.info('get page: %s', response.url)
        id_list = self.sku_re.findall(response.body)
        for skuid in id_list:
            yield SkuIdItem(product_id=skuid)
