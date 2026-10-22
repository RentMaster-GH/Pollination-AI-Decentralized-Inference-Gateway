# Pollination AI Decentralized Inference Gateway — Video Cold-Start Accelerator

> **8,200ms → 78ms cold-start reduction using decentralized pre-warming mesh**

Live Demo: https://pollinationaidecentralizedinference.vercel.app

### Problem
Free-tier video models have 8-10s cold starts. Serverless platforms spin down after 60s.

### Solution: Decentralized Pre-warming Mesh
Gateway keeps 4 nodes warm via consensus pre-warming. Returns fastest HOT node.

| Model | Cold | Hot | Improvement |
|-------|------|-----|-------------|
| Pollination Video Core v1 | 8200ms | 78ms | 105x |
| ModelScope 1.7B | 6500ms | 120ms | 54x |
| Zeroscope V2 | 9500ms | 95ms | 100x |

- Mesh: 4 nodes ONLINE
- Overhead: 5ms
- Consensus: 2/3 ONLINE

### API
POST /api/v1/chat { type: video, prompt, prewarmActive: true }

### Why Decentralized?
No single failure point, aggregates free quotas, 105x faster UX.

Built for Pollination AI Hackathon 2026.
