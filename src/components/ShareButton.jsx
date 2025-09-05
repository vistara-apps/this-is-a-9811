import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import Modal from './Modal'

const ShareButton = ({ variant = 'dialog', content, onShare: _onShare }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pocket Protector Encounter Summary',
          text: content,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      setIsModalOpen(true)
    }
  }

  if (variant === 'dialog') {
    return (
      <>
        <button
          onClick={handleNativeShare}
          className="btn-primary flex items-center space-x-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>

        <Modal
          variant="bottomSheet"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Share Encounter Summary"
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-text-secondary whitespace-pre-wrap">
                {content}
              </p>
            </div>
            
            <button
              onClick={handleCopy}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </Modal>
      </>
    )
  }

  return (
    <button
      onClick={handleNativeShare}
      className="p-2 text-text-secondary hover:text-text-primary"
    >
      <Share2 className="h-5 w-5" />
    </button>
  )
}

export default ShareButton
