"use client";
// import { increment } from "@/app/stores/features/counter/counterSlice";
import { RootState } from "@/app/stores/store";
import { useDispatch, useSelector } from "react-redux";

export default function TestButton() {
	// const count = useSelector((state: RootState) => state.counter.value);
	const dispatch = useDispatch();
	return (
		<button
			onClick={() => {
				// dispatch(increment());
			}}
		>
			{/* {count} */}
		</button>
	);
}
