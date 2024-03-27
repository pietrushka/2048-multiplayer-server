## First time deployment:
1. In AWS Console create AWS Elastic Beanstalk application and environment
2. Install Node.js 
3. Install awscli
4. Fill `~/.aws/config` and `~/.aws/credentials`
5. Install (eb-cli)[https://github.com/aws/aws-elastic-beanstalk-cli-setup?tab=readme-ov-file#macoslinux]
6. run `eb init --profile default`, select region and existing application
7. **run** `eb deploy --staged`

## Notes:
- `eb deply` will automatically zip project excluding files and dirs specified in `.ebignore`
- use `pnpm dockerBackend` to simulate EB build locally, keep it mind that zipped content might be different
