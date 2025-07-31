import { useSuiClientQuery } from "@mysten/dapp-kit"
import { SuiObjectData } from "@mysten/sui/client"
import { FC, useState } from "react"
import { Proposal, VoteNft } from "../../types"
import { EcText } from "../Shared"
import { VoteModal } from "./VoteModal"

interface ProposalItemProps {
    id: string;
    voteNft: VoteNft | undefined;
    onVoteSuccess: () => void
}

export const ProposalItem: FC<ProposalItemProps> = ({id, voteNft, onVoteSuccess}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const { data: dataResponse, isPending, error, refetch: refetchProposals } = useSuiClientQuery(
        "getObject",
        {
            id,
            options: {
                showContent: true
            }
        }
    );

    if(isPending) return <EcText centered text="Loading..."/>
    if(error) return <EcText isError text={`Error: ${error.message}`}/>
    if(!dataResponse) return <EcText centered text="Not Found..."/> 

    const proposal = ParseProposal(dataResponse.data);

    if(!proposal) return null;  

    console.log(proposal)

    const expiration = proposal.expiration; 
    const isDelisted = proposal.status.variant === "Delisted";
    const isExpired = isUnixTimeExpired(expiration) || isDelisted;  

    return (
        <>
            <div 
            onClick={() => !isExpired && setModalOpen(true)}
            className={`${isExpired ? "cursor-not-allowed border-gray-600" : "cursor-pointer hover:border-blue-500"} p-4 border rounded-lg sm:mx-20 md:mx-25 lg:mx-0 shadow-sm bg-white dark:bg-gray-800 transition-colors`}
            >
                <div className="flex justify-between">
                    <p className={`${isExpired ? "text-gray-700" : "text-gray-300"} text-xl font-semibold mb-2`}>
                        {proposal.title}
                    </p>
                    {!!voteNft && <img src={voteNft?.url} className="w-10 h-10 rounded-full" />}
                </div>
                <p className={`${isExpired ? "text-gray-700" : "text-gray-300" }`}>
                    {proposal.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-4">
                        <div className="flex items-center text-green-600">
                            <span className="mr-1">👍</span>
                            {proposal.votedYesCount}
                        </div>
                        <div className="flex items-center text-red-600">
                            <span className="mr-1">👎</span>
                            {proposal.votedNoCount}
                        </div>
                    </div>
                    <div>
                        <p className={`${isExpired || isDelisted ? "text-yellow-600 font-bold" : "text-gray-400"} text-sm`}>
                            {isDelisted ? "Delisted" : (isExpired ? "Expired" : formatUnixTime(expiration))}
                        </p>
                    </div>
                </div>
            </div>
            <VoteModal
                proposal={proposal} 
                hasVoted={!!voteNft}
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)}
                onVote={(_: boolean) =>{ 
                    refetchProposals();
                    onVoteSuccess();
                    setModalOpen(false);
                }} 
            />
        </>
    )
}

function ParseProposal(data: SuiObjectData | null | undefined): Proposal | null {
    if(data?.content?.dataType !== "moveObject") return null;
    const { voted_yes_count, voted_no_count, expiration, ...rest} = data.content.fields as any;

    return{
        ...rest,
        votedYesCount: Number(voted_yes_count),
        votedNoCount: Number(voted_no_count),
        expiration: Number(expiration)
    }
}

function isUnixTimeExpired(unixTimeMs: number) {
    return new Date(unixTimeMs) < new Date();
}

function formatUnixTime(timestampMs: number) {
    if(isUnixTimeExpired(timestampMs)) return "Expired";

    return new Date(timestampMs).toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
}