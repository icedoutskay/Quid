# Quid Store Contract - Query Functions

This document describes the enhanced query functions available in the Quid Store contract for frontend integration.

## Overview

The contract provides several read-only query functions optimized for different frontend use cases:

1. **`get_mission`** - Full mission details
2. **`get_missions`** - Batch query for multiple missions
3. **`mission_exists`** - Lightweight existence check
4. **`get_mission_reward`** - Optimized reward information
5. **`get_mission_status`** - Lightweight status query

## Function Details

### 1. get_mission

**Purpose**: Fetch complete mission details for frontend verification

**Signature**: `get_mission(env: Env, mission_id: u64) -> Result<Mission, QuidError>`

**Returns**: Complete `Mission` struct with all fields:
- `id: u64` - Unique mission identifier
- `owner: Address` - Mission creator's address
- `title: String` - Mission title
- `description_cid: String` - IPFS CID for detailed description
- `reward_token: Address` - Token contract address for rewards
- `reward_amount: i128` - Reward amount per participant
- `max_participants: u32` - Maximum participants (0 = unlimited)
- `participants_count: u32` - Current participant count
- `status: MissionStatus` - Current mission status
- `created_at: u64` - Creation timestamp

**Error**: `QuidError::MissionNotFound` if mission doesn't exist

**Use Case**: Frontend UI verification of mission details including reward amount

```javascript
// Frontend usage example
const mission = await contract.get_mission({mission_id: 123});
console.log(`Reward: ${mission.reward_amount}`);
console.log(`Status: ${mission.status}`);
```

### 2. get_missions

**Purpose**: Batch query multiple missions in a single call

**Signature**: `get_missions(env: Env, mission_ids: Vec<u64>) -> Vec<Result<Mission, QuidError>>`

**Returns**: Vector of Results - each mission ID returns either `Ok(Mission)` or `Err(QuidError::MissionNotFound)`

**Use Case**: Dashboard views that display multiple missions

```javascript
// Frontend usage example
const missionIds = [1, 2, 3, 999]; // 999 doesn't exist
const results = await contract.get_missions({mission_ids: missionIds});

results.forEach((result, index) => {
  if (result.Ok) {
    console.log(`Mission ${missionIds[index]}: ${result.Ok.title}`);
  } else {
    console.log(`Mission ${missionIds[index]} not found`);
  }
});
```

### 3. mission_exists

**Purpose**: Lightweight existence check without loading full data

**Signature**: `mission_exists(env: Env, mission_id: u64) -> bool`

**Returns**: `true` if mission exists, `false` otherwise

**Use Case**: Frontend validation before performing operations

```javascript
// Frontend usage example
const exists = await contract.mission_exists({mission_id: 123});
if (exists) {
  // Safe to fetch full details
  const mission = await contract.get_mission({mission_id: 123});
}
```

### 4. get_mission_reward

**Purpose**: Optimized query for reward information only

**Signature**: `get_mission_reward(env: Env, mission_id: u64) -> Result<(Address, i128), QuidError>`

**Returns**: Tuple of `(reward_token_address, reward_amount)` or error

**Error**: `QuidError::MissionNotFound` if mission doesn't exist

**Use Case**: Reward verification components that don't need full mission details

```javascript
// Frontend usage example
const [tokenAddress, rewardAmount] = await contract.get_mission_reward({mission_id: 123});
console.log(`Reward: ${rewardAmount} of token ${tokenAddress}`);
```

### 5. get_mission_status

**Purpose**: Lightweight status query for UI indicators

**Signature**: `get_mission_status(env: Env, mission_id: u64) -> Result<MissionStatus, QuidError>`

**Returns**: Current `MissionStatus` enum value or error

**Error**: `QuidError::MissionNotFound` if mission doesn't exist

**Use Case**: Status badges, filtering, and mission state indicators

```javascript
// Frontend usage example
const status = await contract.get_mission_status({mission_id: 123});
switch(status) {
  case 'Created':
    console.log('Mission is open for submissions');
    break;
  case 'Started':
    console.log('Mission is in progress');
    break;
  case 'Completed':
    console.log('Mission finished');
    break;
}
```

## Error Handling

All functions that fetch mission data return `QuidError::MissionNotFound` (error code #1) for non-existent mission IDs. The frontend should handle this error appropriately:

```javascript
try {
  const mission = await contract.get_mission({mission_id: 123});
  // Process mission data
} catch (error) {
  if (error.message.includes('Error(Contract, #1)')) {
    console.log('Mission not found');
    // Handle missing mission case
  }
}
```

## Performance Considerations

1. **Use `mission_exists`** for quick validation before expensive operations
2. **Use `get_mission_reward`** when only reward info is needed (reduces data transfer)
3. **Use `get_mission_status`** for status indicators (lightweight)
4. **Use `get_missions`** for batch operations to reduce network calls
5. **Use `get_mission`** only when full mission details are required

## Integration Example

```javascript
// Complete frontend integration example
class MissionService {
  async getMissionDetails(missionId) {
    // First check if mission exists
    const exists = await contract.mission_exists({mission_id: missionId});
    if (!exists) {
      throw new Error('Mission not found');
    }
    
    // Get full details
    const mission = await contract.get_mission({mission_id: missionId});
    
    // Get reward info separately for verification
    const [rewardToken, rewardAmount] = await contract.get_mission_reward({mission_id: missionId});
    
    // Get current status
    const status = await contract.get_mission_status({mission_id: missionId});
    
    return {
      ...mission,
      rewardToken,
      rewardAmount,
      status,
      exists: true
    };
  }
  
  async getMultipleMissions(missionIds) {
    const results = await contract.get_missions({mission_ids: missionIds});
    return results.map((result, index) => ({
      id: missionIds[index],
      data: result.Ok || null,
      error: result.Err || null
    }));
  }
}
```

## Testing

Run contract tests to verify all query functions:

```bash
cd quid-contract
cargo test
```

All 21 tests should pass, including:
- `test_get_mission_returns_exact_struct`
- `test_get_missions_batch_query`
- `test_mission_exists_function`
- `test_get_mission_reward_optimized_query`
- `test_get_mission_status_lightweight_query`