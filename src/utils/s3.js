import AWS from 'aws-sdk';

AWS.config.update({
    region: process.env.REACT_APP_REGION,
    credentials: new AWS.Credentials({
        accessKeyId:process.env.REACT_APP_ACCESSKEYID,
        secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY
    })
});

const s3 = new AWS.S3();

export const handleUpload = (file) => {
    return new Promise((resolve, reject) => {
        const uuid = (Math.random() + 1).toString(36).substring(7);
        if (!file) return resolve({ success: false, message: 'No file provided' });

        const params = {
            Bucket: process.env.REACT_APP_BUCKETNAME,
            Key: `${uuid}_${file.name}`,
            Body: file,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error uploading image:', err);
                reject({ success: false, message: err });
            } else {
                console.log('Image uploaded successfully:', data);
                resolve({ success: true, message: data });
            }
        });
    });
};


export const getPresignedURL = (imageurl) => {
    return new Promise((resolve, reject) => {
        const urlParams = {
            Bucket: process.env.REACT_APP_BUCKETNAME,
            Key: imageurl,
            Expires: 3600,
        }
        s3.getSignedUrl('getObject', urlParams, (err, data) => {
            if (err) {
                console.error('Error uploading image:', err);
                reject({ success: false, message: err });
            } else {
                resolve({ success: true, message: data });
            }
        });
    })
}

export const deleteBucketImage = (key) => {
    return new Promise((resolve, reject) => {
        const deleteParams = {
            Bucket: process.env.REACT_APP_BUCKETNAME,
            Key: key
        }
        s3.deleteObject(deleteParams, (err, data) => {
            if (err) {
                console.error('Error uploading image:', err);
                reject({ success: false, message: err });
            } else {
                console.log(data);
                resolve({ success: true, message: data });
            }
        });
    })

}