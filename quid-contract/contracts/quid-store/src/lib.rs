#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

mod error;
mod types;
use error::QuidError;
use soroban_sdk::token;
use types::{DataKey, Mission, MissionStatus};

/// Quid Store Contract
///
/// A decentralized platform for creating and managing missions where creators
/// can collect feedback and reward participants.
#[contract]
pub struct QuidStoreContract;

#[contractimpl]
impl QuidStoreContract {
    /// Creates a new mission on the blockchain
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `owner` - The address of the mission creator (must sign the transaction)
    /// * `title` - Mission title
    /// * `description_cid` - IPFS CID or reference to detailed mission description
    /// * `reward_token` - Address of the token contract for rewards
    /// * `reward_amount` - Reward amount per participant (in smallest token unit)
    /// * `max_participants` - Maximum number of participants (0 = unlimited)
    ///
    /// # Returns
    /// The unique mission ID or an error
    ///
    /// # Errors
    /// * `QuidError::NegativeReward` - If reward_amount is negative
    ///
    /// # Example
    /// ```ignore
    /// let mission_id = contract.create_mission(
    ///     &env,
    ///     &owner_address,
    ///     &String::from_str(&env, "User Feedback Survey"),
    ///     &String::from_str(&env, "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"),
    ///     &token_address,
    ///     &10_000_000, // 100 tokens (assuming 7 decimals)
    ///     &50,         // Max 50 participants
    /// );
    /// ```
    pub fn create_mission(
        env: Env,
        owner: Address,
        title: String,
        description_cid: String,
        reward_token: Address,
        reward_amount: i128,
        max_participants: u32,
    ) -> Result<u64, QuidError> {
        // 1. Authentication: Verify owner signature
        owner.require_auth();

        // 2. Input Validation
        Self::validate_mission_params(&title, reward_amount)?;

        // 2.5 Escrow Funding: Pull full mission reward into contract

        let total_needed: i128 = reward_amount
            .checked_mul(max_participants as i128)
            .ok_or(QuidError::NegativeReward)?;

        // Token client
        let token_client = token::Client::new(&env, &reward_token);

        // Transfer tokens from creator → contract escrow
        token_client.transfer(&owner, env.current_contract_address(), &total_needed);

        // 3. ID Generation: Get and increment mission count
        let mission_id = Self::get_next_mission_id(&env);

        // 4. Get current timestamp (ensure non-zero for test environments)
        let mut created_at = env.ledger().timestamp();
        if created_at == 0 {
            created_at = 1;
        }

        // 5. Create Mission struct
        let mission = Mission {
            id: mission_id,
            owner: owner.clone(),
            title,
            description_cid,
            reward_token,
            reward_amount,
            max_participants,
            participants_count: 0,
            status: MissionStatus::Created,
            created_at,
        };

        // 6. Save mission to persistent storage
        env.storage()
            .persistent()
            .set(&DataKey::Mission(mission_id), &mission);

        // 7. Extend the TTL (Time To Live) for the mission data
        // This ensures the data persists for a long time
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Mission(mission_id), 5184000, 5184000); // ~60 days

        // 8. Emit event for indexing/monitoring
        #[allow(deprecated)]
        env.events().publish(
            (String::from_str(&env, "mission_created"), owner.clone()),
            mission_id,
        );

        // 9. Return the new mission ID
        Ok(mission_id)
    }

    /// Retrieves a mission by ID
    ///
    /// Fetches the complete mission details from persistent storage.
    /// This is a read-only view function for frontend UI to verify
    /// mission details including reward amount, status, and metadata.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `mission_id` - The unique mission identifier
    ///
    /// # Returns
    /// The complete mission data structure containing all details
    ///
    /// # Errors
    /// * `QuidError::MissionNotFound` - If no mission exists with the given ID
    ///
    /// # Example
    /// ```ignore
    /// let mission = contract.get_mission(&env, &123);
    /// println!("Reward: {}", mission.reward_amount);
    /// println!("Status: {:?}", mission.status);
    /// ```
    pub fn get_mission(env: Env, mission_id: u64) -> Result<Mission, QuidError> {
        env.storage()
            .persistent()
            .get(&DataKey::Mission(mission_id))
            .ok_or(QuidError::MissionNotFound)
    }

    /// Retrieves multiple missions by their IDs
    ///
    /// Batch query function to fetch multiple missions in a single call.
    /// Useful for frontend dashboards that need to display multiple missions.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `mission_ids` - Vector of mission IDs to fetch
    ///
    /// # Returns
    /// Vector of mission results (either Mission or QuidError::MissionNotFound)
    ///
    /// # Example
    /// ```ignore
    /// let missions = contract.get_missions(&env, &vec![&env, 1, 2, 3]);
    /// for result in missions {
    ///     match result {
    ///         Ok(mission) => println!("Found: {}", mission.title),
    ///         Err(_) => println!("Mission not found"),
    ///     }
    /// }
    /// ```
    pub fn get_missions(env: Env, mission_ids: Vec<u64>) -> Vec<Result<Mission, QuidError>> {
        let mut results = Vec::new(&env);
        
        for mission_id in mission_ids.iter() {
            let result = Self::get_mission(env.clone(), mission_id);
            results.push_back(result);
        }
        
        results
    }

    /// Checks if a mission exists
    ///
    /// Lightweight existence check without loading the full mission data.
    /// Useful for frontend validation before performing operations.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `mission_id` - The mission ID to check
    ///
    /// # Returns
    /// `true` if mission exists, `false` otherwise
    ///
    /// # Example
    /// ```ignore
    /// if contract.mission_exists(&env, &123) {
    ///     // Safe to proceed with get_mission
    ///     let mission = contract.get_mission(&env, &123);
    /// }
    /// ```
    pub fn mission_exists(env: Env, mission_id: u64) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Mission(mission_id))
    }

    /// Gets mission reward details only
    ///
    /// Optimized function to fetch only reward-related information.
    /// Reduces data transfer for frontend components that only need
    /// reward verification without full mission details.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `mission_id` - The mission ID
    ///
    /// # Returns
    /// Tuple of (reward_token_address, reward_amount) or error
    ///
    /// # Errors
    /// * `QuidError::MissionNotFound` - If mission doesn't exist
    ///
    /// # Example
    /// ```ignore
    /// let (token, amount) = contract.get_mission_reward(&env, &123)?;
    /// println!("Reward: {} of token {:?}", amount, token);
    /// ```
    pub fn get_mission_reward(env: Env, mission_id: u64) -> Result<(Address, i128), QuidError> {
        let mission = Self::get_mission(env, mission_id)?;
        Ok((mission.reward_token, mission.reward_amount))
    }

    /// Gets mission status only
    ///
    /// Lightweight function to fetch only the mission status.
    /// Useful for frontend status indicators and filtering.
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `mission_id` - The mission ID
    ///
    /// # Returns
    /// The current mission status or error
    ///
    /// # Errors
    /// * `QuidError::MissionNotFound` - If mission doesn't exist
    ///
    /// # Example
    /// ```ignore
    /// let status = contract.get_mission_status(&env, &123)?;
    /// match status {
    ///     MissionStatus::Created => println!("Mission is open"),
    ///     MissionStatus::Completed => println!("Mission finished"),
    ///     _ => println!("Mission status: {:?}", status),
    /// }
    /// ```
    pub fn get_mission_status(env: Env, mission_id: u64) -> Result<MissionStatus, QuidError> {
        let mission = Self::get_mission(env, mission_id)?;
        Ok(mission.status)
    }

    /// Gets the current mission count
    ///
    /// # Arguments
    /// * `env` - The contract environment
    ///
    /// # Returns
    /// The total number of missions created
    pub fn get_mission_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::MissionCount)
            .unwrap_or(0)
    }

    /// Updates mission status (for future use)
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `mission_id` - The mission to update
    /// * `new_status` - The new status to set
    ///
    /// # Errors
    /// * `QuidError::MissionNotFound` - If mission doesn't exist
    /// * `QuidError::NotAuthorized` - If caller is not the mission owner
    pub fn update_mission_status(
        env: Env,
        mission_id: u64,
        new_status: MissionStatus,
    ) -> Result<(), QuidError> {
        let mut mission = Self::get_mission(env.clone(), mission_id)?;

        // Verify caller is the owner
        mission.owner.require_auth();

        // Update status
        mission.status = new_status;

        // Save updated mission
        env.storage()
            .persistent()
            .set(&DataKey::Mission(mission_id), &mission);

        // Emit event
        #[allow(deprecated)]
        env.events().publish(
            (String::from_str(&env, "mission_status_updated"), mission_id),
            new_status,
        );

        Ok(())
    }

    // ========== Private Helper Methods ==========

    /// Validates mission creation parameters
    ///
    /// # Errors
    /// * `QuidError::NegativeReward` - If reward_amount is negative
    fn validate_mission_params(_title: &String, reward_amount: i128) -> Result<(), QuidError> {
        // Title validation removed - empty titles might be valid for some use cases

        // Reward amount must be non-negative
        if reward_amount <= 0 {
            return Err(QuidError::NegativeReward);
        }

        Ok(())
    }

    /// Gets the next available mission ID and increments the counter
    ///
    /// # Returns
    /// The next mission ID
    ///
    /// # Panics
    /// If mission count overflows (extremely unlikely in practice)
    fn get_next_mission_id(env: &Env) -> u64 {
        // Get current count from instance storage (ephemeral, survives contract calls)
        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::MissionCount)
            .unwrap_or(0);

        // Increment for new mission
        count = count.checked_add(1).expect("Mission count overflow");

        // Save updated count
        env.storage().instance().set(&DataKey::MissionCount, &count);

        count
    }
}

mod test;
