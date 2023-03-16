import "../css/previewAttachmentStyle.css";

interface Props {
  attachment: File | null;
  doShow: boolean;
  onRemoveAttachmentClicked: () => void;
}

const PreviewAttachment: React.FC<Props> = ({ attachment, doShow, onRemoveAttachmentClicked }) => {
  if (!doShow || !attachment) {
    return null;
  }

  return (
    <div className="paCtnr">
      <div className="paimageWrapper">
        <img
          id="paMedia"
          src={URL.createObjectURL(attachment)}
          alt="attachment preview"
        />
        <div className="paCancelOverlayCtnr">
          <span className="paCancelBtn" onClick={() => onRemoveAttachmentClicked()}>
            <i className="fa-solid fa-xmark" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreviewAttachment;
