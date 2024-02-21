 # ABE-PROTOTYPE

To deploy:
```
npm run build
aws s3 sync ./build/ s3://bucket-name
aws cloudfront create-invalidation --distribution-id CLOUDFRONT_ID --paths "/*"
```