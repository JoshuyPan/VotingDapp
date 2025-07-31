import { ConnectButton } from "@mysten/dapp-kit";
import { useNavigation } from "../providers/navigation/NavigationContext";

const Navbar =  () => {
    const {currentPage, navigate} = useNavigation();

    return (
        <nav className="bg-gray-200 dark:bg-gray-800 p-4 shadow-md">
            <div className="flex justify-between">
                <ul className="flex space-x-6">
                    <li>
                        <button className={`px-4 py-2 rounded ${currentPage === "/" ? "bg-blue-400 underline" : ""}`}
                        onClick={() => navigate("/")}
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button className={`px-4 py-2 rounded ${currentPage === "/wallet" ? "bg-blue-400 underline" : ""}`}
                        onClick={() => navigate("/wallet")}
                        >
                            Wallet
                        </button>
                    </li>
                </ul>
                <ConnectButton />
            </div>
        </nav>
    )
}

export default Navbar