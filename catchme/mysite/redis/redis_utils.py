import redis

redis_client = redis.Redis(host='your-elasticache-endpoint', port=6379, db=0)