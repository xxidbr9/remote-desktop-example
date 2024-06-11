import { invoke } from '@tauri-apps/api/core'
import { Button } from '@/components/ui'
import { useParams } from '@tanstack/react-router'

type Props = {}


export const RemoteLayout = (props: Props) => {
  const handleCloseRemote = () => {
    invoke("close_remote");
  }

  const { id } = useParams({ from: "/remote/$id" })

  return (
    <div className='dark h-screen w-screen'>
      <span>{id}</span>
      <Button variant={'destructive'} className='cursor-pointer absolute bottom-6 right-6' onClick={handleCloseRemote}>
        Close Remote
      </Button>
    </div>
  )
}