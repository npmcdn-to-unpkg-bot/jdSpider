# -*- coding: utf-8 -*-
import re
import scrapy
from jdSpider.items import SkuIdItem
from jdSpider import  pipelines

class SkuidListSpoder(scrapy.Spider):
    name = "skuid_list"
    allowed_domains = ["jd.com"]
    base_url = 'http://list.jd.com/list.html?cat=1713,3287,3797&go=0'
    start_urls = base_url

