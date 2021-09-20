FROM public.ecr.aws/lambda/python:3.8

COPY requirements.txt ./

RUN python3.8 -m pip install --upgrade pip
RUN python3.8 -m pip install -r requirements.txt -t .

COPY library ./library
COPY app.py ./

CMD ["app.lambda_handler"]
