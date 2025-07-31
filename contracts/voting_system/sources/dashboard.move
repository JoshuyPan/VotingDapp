module voting_system::dashboard{

    // === Imports ===
    use sui::types;

    // === Errors ===
    #[error]
    const E_DUPLICATE_PROPOSAL: u64 = 0;
    #[error]
    const E_INVALID_OTW: u64 = 1;

    // === Constants ===

    // === Structs ===
    public struct AdminCap has key {
        id: UID,
    }

    public struct DASHBOARD has drop {}

    public struct Dashboard has key{
        id: UID,
        proposals_ids: vector<ID>
    }

    // === Events ===

    // === Method Aliases ===

    // === Public Functions ===
    fun init(otw: DASHBOARD, ctx: &mut TxContext) { 
        assert!(types::is_one_time_witness(&otw), E_INVALID_OTW);
        new(otw, ctx);
        transfer::transfer(AdminCap { 
            id: object::new(ctx)
         }, ctx.sender())
    }

    public fun register_proposal(self: &mut Dashboard, _admin_cap: &AdminCap, proposal_id: ID) {
        assert!(!self.proposals_ids.contains(&proposal_id), E_DUPLICATE_PROPOSAL);
        self.proposals_ids.push_back(proposal_id);
    }

    // === View Functions ===
    public fun proposal_ids(self: &Dashboard): vector<ID> {
        self.proposals_ids
    }


    // === Admin Functions ===
    public fun new(_otw: DASHBOARD, ctx: &mut TxContext) {
        let dashboard = Dashboard { 
            id: object::new(ctx),
            proposals_ids: vector[]
         };

         transfer::share_object(dashboard)
    }

    // === Package Functions ===

    // === Private Functions ===

    // === Test Functions ===
    #[test_only]
    public fun issue_admin_cap(ctx: &mut TxContext) {
        transfer::transfer(AdminCap { id: object::new(ctx) },ctx.sender());
    }

    #[test_only]
    public fun new_otw(): DASHBOARD {
        DASHBOARD { }
    }

    #[test]
    fun test_module_init() {
        use sui::test_scenario;
        let creator = @0xCA;

        let mut scenario = test_scenario::begin(creator);
        {
            let otw = DASHBOARD{};
            init(otw,scenario.ctx());
        };

        scenario.next_tx(creator);
        {
            let dashboard = scenario.take_shared<Dashboard>();
            assert!(dashboard.proposals_ids.is_empty(), 1);
            test_scenario::return_shared(dashboard);
        };

        scenario.end();
    }
}




