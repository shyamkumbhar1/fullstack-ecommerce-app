# Docker Configuration

All Docker-related files are organized in this folder.

## Structure

```
docker/
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml     # Development setup
├── backend/
│   ├── Dockerfile              # Production backend image
│   ├── Dockerfile.dev         # Development backend image
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Production frontend image
│   ├── Dockerfile.dev         # Development frontend image
│   ├── nginx.conf             # Nginx configuration
│   └── .dockerignore
└── README.md                  # This file
```

## Usage

### Production

```bash
# From project root
cd docker
docker-compose up -d

# Or from project root
docker-compose -f docker/docker-compose.yml up -d
```

### Development

```bash
# From project root
cd docker
docker-compose -f docker-compose.dev.yml up -d

# Or from project root
docker-compose -f docker/docker-compose.dev.yml up -d
```

## Notes

- All paths in docker-compose files are relative to the `docker/` folder
- Backend context: `../server`
- Frontend context: `../client`
- Dockerfiles are referenced with relative paths from docker-compose files

