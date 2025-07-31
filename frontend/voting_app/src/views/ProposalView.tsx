import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../config/NetworkConfig";
import { PaginatedObjectsResponse, SuiObjectData } from "@mysten/sui/client";
import { ProposalItem } from "../components/proposal/ProposalItem";
import { EcText } from "../components/Shared";
import { useVoteNfts } from "../hooks/useVoteNfts";
import { VoteNft } from "../types";

const ProposalView = () => {

    const dashboard_id = useNetworkVariable("dashboardId");
    const { data: voteNFTsResponse, refetch: refetchNfts} = useVoteNfts();
    const {data: dataResponse, isPending, error} = useSuiClientQuery(
        "getObject", {
            id: dashboard_id,
            options: {
                showContent: true
            }
        }
    );

    if(isPending) return <EcText centered text="Loading..."/>
    if(error) return <EcText isError text={`Error: ${error.message}`}/>
    if(!dataResponse) return <EcText centered text="Not Found..."/> 

    const voteNFTs = extractVoteNfts(voteNFTsResponse);
    console.log(voteNFTs);

    return (
        <>
            <h1 className="text-4xl font-bold mb-8 text-center">Proposal App</h1>
            <div className="grid grid-cols-1 sm:grid-col-2 lg:grid-cols-3 gap-6">
                {/* {new Array(PROPOSAL_COUNT).fill(Math.random()).map((id) =>
                <ProposalItem key={id * Math.random()} />
            )} */}
            {getDashboardFields(dataResponse.data)?.proposals_ids.map(id =>
                <ProposalItem 
                    key={id} 
                    id={id} 
                    onVoteSuccess={() => refetchNfts()}
                    voteNft={voteNFTs.find((nft) => nft.proposalId === id)} />
            )}
            </div>
        </>
    )
}

function getDashboardFields(data: SuiObjectData | null | undefined) {
    if(data?.content?.dataType !== "moveObject") return null;
    return data.content.fields as {
        id: SuiID,
        proposals_ids: string[]
    }
}

function extractVoteNfts(nftRes: PaginatedObjectsResponse | undefined) {
    if(!nftRes?.data) return [];
    return nftRes.data.map(nftObj => getVoteNft(nftObj.data))
}

function getVoteNft(nftObj: SuiObjectData | null | undefined): VoteNft {
    if(nftObj?.content?.dataType !== "moveObject") {
        return{
            id: {id: ""},
            proposalId: "",
            url: ""
        }
    };

    const { proposal_id: proposalId, url, id } = nftObj.content.fields as any
    return{
        proposalId,
        id,
        url
    }
}

export default ProposalView