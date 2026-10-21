import Header from './components/Header';
import GeoMeshMap from './components/GeoMeshMap';
import GatewayPlayground from './components/GatewayPlayground';
import NodeMeshManager from './components/NodeMeshManager';
import VideoAccelerator from './components/VideoAccelerator';
export default function App(){
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-8"><GeoMeshMap /><GatewayPlayground /></div>
        <div className="col-span-4"><NodeMeshManager /><VideoAccelerator /></div>
      </div>
    </div>
  )
}
