import Blackboard from './components/blackboard/Blackboard'
import './App.css'

const App: React.FC = () => {
  return (
    <div className='app'>
      <h1 className='title'>Blackboard Drawing</h1>
      <Blackboard />
    </div> 
  );
};

export default App;
