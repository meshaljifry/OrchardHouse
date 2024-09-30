import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function Payments() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <div>
    <h1 className="text-2xl font-semibold mb-4">Products</h1>
    
    
    {/* Adding the Giphy embed */}
    <div style={{ width: "100%", height: 0, paddingBottom: "100%", position: "relative" }}>
      <iframe
        src="https://giphy.com/embed/vR1dPIYzQmkRzLZk2w"
        width="100%"
        height="100%"
        style={{ position: "absolute" }}
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe>
    </div>
    <p>
      <a href="https://giphy.com/gifs/pudgypenguins-maintenance-under-construction-vR1dPIYzQmkRzLZk2w">
        via GIPHY
      </a>
    </p>
  </div>
  );
}