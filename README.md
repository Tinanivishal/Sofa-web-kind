# Sofa Project - Kind Kubernetes Deployment Guide

This guide provides step-by-step instructions for deploying the Sofa Project on Kind (Kubernetes in Docker).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- [Docker Hub](https://hub.docker.com/) account with push access

## Project Structure

```
Sofa-project/
├── Server/
│   ├── k8s/
│   │   ├── cluster.yml              # Kind cluster configuration
│   │   ├── deployment.yml           # Backend deployment
│   │   ├── service.yml              # Backend service
│   │   ├── secretes.yml             # Application secrets
│   │   ├── ingress.yml              # Ingress configuration
│   │   └── database/
│   │       ├── stateful.yml         # PostgreSQL StatefulSet
│   │       ├── service.yml          # PostgreSQL service
│   │       ├── pv.yml               # Persistent Volume
│   │       └── networkpolicy.yml    # Network policy
│   └── Dockerfile
└── User frontend/
    ├── k8s/
    │   ├── deployment.yml           # Frontend deployment
    │   └── service.yml              # Frontend service
    └── Dockerfile
```

## Deployment Steps

### 1. Create and Configure Kind Cluster

```bash
# Create Kind cluster using the provided configuration
kind create cluster --config Server/k8s/cluster.yml --name sofa-cluster

# Verify cluster is running
kubectl cluster-info --context kind-sofa-cluster
```

### 2. Build and Push Docker Images

#### Backend Image
```bash
cd Server
docker build -t vishaltinani/sofa-web:latest .
docker push vishaltinani/sofa-web:latest
```

#### Frontend Image
```bash
cd "User frontend"
docker build -t vishaltinani/sofa-frontend:v1 .
docker push vishaltinani/sofa-frontend:v1
```

### 3. Deploy Database

```bash
# Apply database configurations
kubectl apply -f Server/k8s/database/database/stateful.yml
kubectl apply -f Server/k8s/database/database/service.yml
kubectl apply -f Server/k8s/database/database/pv.yml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=backendsofa-db --timeout=300s
```

### 4. Deploy Application Secrets

```bash
# Apply secrets configuration
kubectl apply -f Server/k8s/secretes.yml
```

⚠️ **Important**: Update the secrets in `Server/k8s/secretes.yml` with your actual values before deploying.

### 5. Deploy Backend Application

```bash
# Apply backend deployment and service
kubectl apply -f Server/k8s/deployment.yml
kubectl apply -f Server/k8s/service.yml

# Wait for backend to be ready
kubectl wait --for=condition=available deployment/backendsofa --timeout=300s
```

### 6. Deploy Frontend Application

First, create frontend secrets:

```bash
# Create frontend secrets (update with your backend URL)
kubectl create secret generic frontend-secrets \
  --from-literal=VITE_BACKEND_URL=http://backendsofa
```

Then deploy frontend:

```bash
# Apply frontend deployment and service
kubectl apply -f "User frontend/k8s/deployment.yml"
kubectl apply -f "User frontend/k8s/service.yml"

# Wait for frontend to be ready
kubectl wait --for=condition=available deployment/frontend-app --timeout=300s
```

### 7. Setup Ingress (Optional)

```bash
# Apply ingress configuration for external access
kubectl apply -f Server/k8s/ingress.yml
```

## Verification

### Check All Resources

```bash
# Check all pods
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# Check persistent volumes
kubectl get pv,pvc
```

### Access Applications

#### Port Forwarding (Development)

```bash
# Forward backend port
kubectl port-forward service/backendsofa 8080:80

# Forward frontend port
kubectl port-forward service/frontend-app 5173:80
```

#### NodePort Access

```bash
# Get node ports
kubectl get service backendsofa frontend-app

# Access via node ports
# Backend: http://localhost:<backend-nodeport>
# Frontend: http://localhost:<frontend-nodeport>
```

## Configuration Details

### Backend Service
- **Image**: `vishaltinani/sofa-web:latest`
- **Port**: 3000 (container), 80 (service)
- **Replicas**: 2
- **Environment Variables**: Loaded from secrets

### Frontend Service
- **Image**: `vishaltinani/sofa-frontend:v1`
- **Port**: 5173 (container), 80 (service)
- **Environment Variables**: Backend URL from secrets

### Database
- **Image**: `postgres:13`
- **Port**: 5432
- **Storage**: 2Gi persistent volume
- **Type**: StatefulSet for data persistence

## Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Image pull errors**
   - Verify Docker Hub credentials
   - Check image names and tags
   - Ensure images are publicly accessible

3. **Database connection issues**
   - Verify secrets are correctly configured
   - Check database pod logs
   - Ensure database service is running

4. **Network connectivity**
   ```bash
   # Test connectivity between pods
   kubectl exec -it <backend-pod> -- curl http://backendsofa
   kubectl exec -it <frontend-pod> -- curl http://backendsofa
   ```

### Reset Deployment

```bash
# Delete all resources
kubectl delete deployment backendsofa frontend-app
kubectl delete service backendsofa frontend-app
kubectl delete statefulset backendsofa-db
kubectl delete secret backendsofa-secrets frontend-secrets
kubectl delete pvc postgres-data-backendsofa-db-0

# Redeploy following steps 3-6
```

### Delete Kind Cluster

```bash
kind delete cluster --name sofa-cluster
```

## Production Considerations

1. **Security**: Update default secrets and passwords
2. **Resource Limits**: Add resource requests and limits to containers
3. **Monitoring**: Implement logging and monitoring solutions
4. **Backup**: Set up database backup strategies
5. **SSL/TLS**: Configure HTTPS with proper certificates
6. **Scaling**: Configure Horizontal Pod Autoscaler if needed

## Support

For issues related to:
- **Kubernetes**: Check Kubernetes documentation
- **Kind**: Refer to [Kind documentation](https://kind.sigs.k8s.io/)
- **Application**: Check application logs and configuration

---

**Note**: This deployment guide assumes you have the necessary Docker images built and pushed to Docker Hub. Update image names and tags in the YAML files if using a different registry.
