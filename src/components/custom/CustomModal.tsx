import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";

interface CustomModalProps {
	open: boolean;
	onClose: () => void;
	size: string;
	children: React.ReactNode;
}

const CustomModal = ({ open, onClose, children, size }: CustomModalProps) => {
	return (
		<Transition show={open} appear as={Fragment}>
			<Dialog as="div" className="relative z-999" onClose={onClose}>
				<div className="fixed inset-0 bg-black bg-opacity-50" />

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel
								className={`"w-full overflow-hidden rounded-lg text-left align-middle ${size}`}
							>
								<div className="relative flex w-full items-center overflow-hidden bg-white shadow-2xl p-6">
									<div className="absolute right-1 top-1">
										<Button
											variant="ghost"
											className="hover:bg-transparent hover:opacity-75"
											onClick={onClose}
											size={"icon"}
										>
											<X className="h-6 w-6" />
										</Button>
									</div>
									{children}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default CustomModal;
