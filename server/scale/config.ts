/**
 * YOVE ACADEMY - SCALE & CLOUD ARCHITECTURE CONFIG
 * Configuration parameters for 10,000 to 100,000+ concurrent user scaling.
 */

export interface ScaleTierConfig {
  tierName: string;
  concurrentUsersTarget: number;
  minBackendInstances: number;
  maxBackendInstances: number;
  dbPrimaryConnections: number;
  dbReadReplicasCount: number;
  dbReadReplicaConnections: number;
  redisClusterNodes: number;
  cdnEdgeBandwidthGbps: number;
  queueWorkersCount: number;
  maxRpsCapacity: number;
}

export const SCALE_TIERS: Record<string, ScaleTierConfig> = {
  '10k': {
    tierName: 'Tier 1: High Velocity (10k Concurrent)',
    concurrentUsersTarget: 10000,
    minBackendInstances: 4,
    maxBackendInstances: 12,
    dbPrimaryConnections: 50,
    dbReadReplicasCount: 2,
    dbReadReplicaConnections: 100,
    redisClusterNodes: 3,
    cdnEdgeBandwidthGbps: 10,
    queueWorkersCount: 8,
    maxRpsCapacity: 2500,
  },
  '25k': {
    tierName: 'Tier 2: Enterprise Growth (25k Concurrent)',
    concurrentUsersTarget: 25000,
    minBackendInstances: 10,
    maxBackendInstances: 28,
    dbPrimaryConnections: 100,
    dbReadReplicasCount: 4,
    dbReadReplicaConnections: 250,
    redisClusterNodes: 6,
    cdnEdgeBandwidthGbps: 25,
    queueWorkersCount: 20,
    maxRpsCapacity: 6500,
  },
  '50k': {
    tierName: 'Tier 3: Massive Scale (50k Concurrent)',
    concurrentUsersTarget: 50000,
    minBackendInstances: 20,
    maxBackendInstances: 55,
    dbPrimaryConnections: 200,
    dbReadReplicasCount: 8,
    dbReadReplicaConnections: 500,
    redisClusterNodes: 12,
    cdnEdgeBandwidthGbps: 50,
    queueWorkersCount: 40,
    maxRpsCapacity: 13000,
  },
  '100k': {
    tierName: 'Tier 4: Hyper-Scale (100k+ Concurrent)',
    concurrentUsersTarget: 100000,
    minBackendInstances: 40,
    maxBackendInstances: 120,
    dbPrimaryConnections: 400,
    dbReadReplicasCount: 16,
    dbReadReplicaConnections: 1000,
    redisClusterNodes: 24,
    cdnEdgeBandwidthGbps: 100,
    queueWorkersCount: 80,
    maxRpsCapacity: 28000,
  },
};

export const AUTOSCALING_RULES = {
  cpuScaleOutThreshold: 70, // %
  cpuScaleInThreshold: 30, // %
  ramScaleOutThreshold: 80, // %
  dbPoolSaturationThreshold: 85, // %
  latencyThresholdMs: 250, // ms
  cooldownPeriodSeconds: 180,
};

export const INFRASTRUCTURE_CONFIG = {
  cdnDomain: process.env.YOVE_CDN_DOMAIN || 'https://cdn.yoveacademy.com',
  objectStorageBucket: process.env.YOVE_STORAGE_BUCKET || 'yove-media-assets-prod',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD || '',
  dbHost: process.env.DB_HOST || 'localhost',
  dbReadReplicas: (process.env.DB_READ_REPLICAS || '').split(',').filter(Boolean),
  signedUrlExpirationSeconds: 3600, // 1 hour for secure CDN media access
};
