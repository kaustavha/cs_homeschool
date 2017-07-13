# Deepdream
To get deepdream working in an ipython notebook form:

- Get docker image containing essentials for deep-learning from https://github.com/floydhub/dl-docker  
`
docker pull floydhub/dl-docker:cpu
`
`docker run -it -p 8888:8888 -p 6006:6006 -v </sharedfolder/local/path>:</root/sharedfolder/path in/container> floydhub/dl-docker:cpu bash
`
- Get the deep dream libray in the sharedfolder with `git clone https://github.com/google/deepdream`. 
- Download one or more caffe model binaries:  
`cd caffe`  
`scripts/download_model_binary.py <dirname>`   
note: dirname for deepdream will be `models/bvlc_googlenet`

You can now attempt to run the notebook from inside the docker container:
`docker attach <containerId>`  
`cd deepdream`  
`jupyter notebook`


