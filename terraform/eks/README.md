# Setup

1. Run
   `aws sts assume-role --role-arn arn:aws:iam::SOME_ACCOUNT_ID:role/SOME_ROLE --role-session-name "SOME_SESSION_NAME" --profile SOME_PROFILE`
2. Export the following environment variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN`
   - `AWS_PROFILE`
3. Run `terraform apply`
4. After applying the terraform, attach the new role your previously assumed
   role
5. Run
   `aws eks --region cluster-region update-kubeconfig --name cluster-name-output --profile=some-profile`
