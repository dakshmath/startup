from app.workers.analysis_tasks import celery_app

if __name__ == "__main__":
    celery_app.start()
