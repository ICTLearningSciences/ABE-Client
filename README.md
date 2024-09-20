 # ABE-PROTOTYPE

To deploy:
```
npm run build
aws s3 sync ./build/ s3://bucket-name
aws cloudfront create-invalidation --distribution-id CLOUDFRONT_ID --paths "/*"
```


To publish to npm:
1. Update the version in package.json
2. make publish