import { selectedThreadMetadataState } from "../utils/recoilState";
import { useRecoilValue } from "recoil";

export default function useSelectedThreadMetadata() {
	return useRecoilValue(selectedThreadMetadataState);
}
