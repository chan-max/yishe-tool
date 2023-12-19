
import COS from 'cos-js-sdk-v5';

const cos = new COS({
    SecretId: 'your-secret-id',
    SecretKey: 'your-secret-key',
    Bucket: 'your-bucket-name',
    Region: 'your-bucket-region'
});