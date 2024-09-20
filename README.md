 # ABE-PROTOTYPE

To deploy:
```
npm run build
aws s3 sync ./build/ s3://bucket-name
aws cloudfront create-invalidation --distribution-id CLOUDFRONT_ID --paths "/*"
```


Publishing components to npm for SPFx gotchas:
- SPFx doesn't support react dom so make sure you don't invoke it in any of the components used in SPFx
- Have to manually (script) copy any non ts/js files to the dist folder (see npm script "build-copy-files")