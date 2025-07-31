type ProposalStatus = {
    variant: "Active" | "Delisted"
}

export interface Proposal {
    id: SuiID,
    title: string,
    description: string,
    status: ProposalStatus,
    votedYesCount: string,
    votedNoCount: string,
    expiration: number,
    creator: string,
    voterRegistry: string[]
};

export interface VoteNft {
    id: SuiID,
    proposalId: string,
    url: string
};