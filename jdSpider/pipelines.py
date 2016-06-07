# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import functools
import redis
from jdSpider import redis_pool
import pymongo

r = redis.Redis(connection_pool=redis_pool)


def check_spider_pipeline(process_item_method):
    @functools.wraps(process_item_method)
    def wrapper(self, item, spider):
        # message template for debugging
        msg = '%%s %s pipeline step' % (self.__class__.__name__,)

        # if class is in the spider's pipeline, then use the
        # process_item method normally.
        if self.__class__ in spider.pipeline:
            spider.logger.debug(msg % 'executing')
            return process_item_method(self, item, spider)

        # # otherwise, just return the untouched item (skip this step in
        # # the pipeline)
        else:
            spider.logger.debug(msg % 'skipping')
            return item
        # return process_item_method(self, item, spider)
    return wrapper


class MongoPipeline(object):

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.collection_name = ""
        print "init"

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]
        self.collection_name = spider.collection_name

    def close_spider(self, spider):
        self.client.close()

    @check_spider_pipeline
    def process_item(self, item, spider):
        comment = dict(item)
        print comment['comments']["guid"]
        self.db[self.collection_name].update_one({
            'comments.guid': comment['comments']['guid']
        }, {
            '$set': comment

        }, upsert=True)
        # self.db[self.collection_name].insert(dict(item))
        return item


class SkuidRedisPipeline(object):
    def __init__(self):
        self.redisSetName = ""

    def open_spider(self, spider):
        self.redisSetName = spider.set_name
        print self.redisSetName

    @check_spider_pipeline
    def process_item(self, item, spider):
        r.sadd('productId' + self.redisSetName + ':queue', item['product_id'])
        r.sadd('commentsId' + self.redisSetName + ':queue', item['product_id'])
        return item
        # pass


