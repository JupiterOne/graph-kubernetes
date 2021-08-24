# Development

## Documentation

- [Kubernetes Reference Documentation](https://kubernetes.io/docs/reference/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)

## Prerequisites

- Kubernetes: The quickest way to get setup with one is through `docker for mac`
  or a managed setup through GKE/AKS/EKS.
- [Tilt](https://tilt.dev): This is used to hot reload the integration and make
  it easier to test changes incrementally. We can also preview what type of
  telemetry we'll be exposing to end users because it mimics the customer setup.

1. Create a Kubernetes integration.
2. Fill out the `.env` file with the appropriate values.
3. Run `tilt up`.
4. Press `s` for log streaming or `space` to get a browser application to
   explore the logs.
5. Verify integration jobs are being kicked off in your Kubernetes integration.
