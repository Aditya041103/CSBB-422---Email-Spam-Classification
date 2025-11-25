import os
import traceback
import sys
from fastapi import FastAPI
from pydantic import BaseModel
from pyspark.sql import SparkSession
from pyspark.ml import PipelineModel
from pyspark.sql.functions import col
from fastapi.middleware.cors import CORSMiddleware
from pyspark import SparkConf  # ⭐ REQUIRED

# =========================
# ENVIRONMENT CONFIGURATION
# =========================
os.environ['PYSPARK_PYTHON'] = r"C:\Users\adity\AppData\Local\Programs\Python\Python312\python.exe"
os.environ['PYSPARK_DRIVER_PYTHON'] = r"C:\Users\adity\AppData\Local\Programs\Python\Python312\python.exe"
os.environ["JAVA_HOME"] = r"C:\Program Files\OpenLogic\jdk-17.0.13.11-hotspot"
os.environ["SPARK_HOME"] = r"C:\Spark\spark-4.0.1-bin-hadoop3"
os.environ["HADOOP_HOME"] = r"C:\Hadoop"
# os.environ["PYSPARK_SUBMIT_ARGS"] = "--master local[*] pyspark-shell"

# Spark configuration
conf = SparkConf()
conf.set("spark.python.worker.faulthandler.enabled", "true")
conf.set("spark.sql.execution.pyspark.udf.faulthandler.enabled", "true")
conf.set("spark.driver.memory", "4g")
conf.set("spark.executor.memory", "4g")
conf.set("spark.python.worker.reuse", "true")            # reuse same socket
conf.set("spark.executor.instances", "1")                # only 1 executor
conf.set("spark.executor.cores", "1")                    # only 1 worker
conf.set("spark.task.maxFailures", "1")                  # stop retrying



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

spark = None
model = None

# =========================
# Request body model
# =========================
class TextInput(BaseModel):
    text: str

# =========================
# Startup Event: Initialize Spark + Load Model
# =========================
@app.on_event("startup")
def startup_event():
    global spark, model
    try:
        spark = (
            SparkSession.builder
            .appName("Spam-Detection-API")
            .config(conf=conf)   # ⭐ Apply SparkConf here!
            .getOrCreate()
        )

        print("Spark initialized successfully!")

        model = PipelineModel.load("spam_model")
        print("Model loaded successfully!")

    except Exception as e:
        print(f"Startup error: {e}")
        traceback.print_exc()
        raise e

# =========================
# Health check
# =========================
@app.get("/")
async def health():
    return {"health": "activelyrunning"}

# =========================
# Predict endpoint
# =========================
@app.post("/predict")
async def predict(input_data: TextInput):
    try:
        text = input_data.text
        df = spark.createDataFrame([(text,)], ["text"])
        prediction = model.transform(df).select(col("prediction")).collect()[0][0]
        result = "SPAM" if prediction == 1 else "NOT SPAM"
        return {"prediction": result}
    except Exception as e:
        return {"error": str(e)}

# =========================
# Main
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("predict_api:app", host="localhost", port=6754, reload=False)











