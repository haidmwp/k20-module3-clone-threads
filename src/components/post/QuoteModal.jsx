import ReplyModal from "@/components/post/ReplyModal";

/** Tái sử dụng ReplyModal: placeholder "Quote this post..." + preview post được quote */
export default function QuoteModal(props) {
  return <ReplyModal {...props} mode="quote" />;
}
