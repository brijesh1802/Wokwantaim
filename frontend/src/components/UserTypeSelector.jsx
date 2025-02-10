import { User, Building2 } from 'lucide-react'

function UserTypeSelector({ selectedType, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <button
        onClick={() => onSelect("candidate")}
        className={`flex items-center gap-2 p-4 border rounded-lg transition-colors ${
          selectedType === "candidate" 
            ? "border-orange-500 bg-orange-50 text-orange-600" 
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <User className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm text-gray-500">Candidate</div>
          <div className="font-medium">Login as a Candidate</div>
        </div>
      </button>
      <button
        onClick={() => onSelect("employer")}
        className={`flex items-center gap-2 p-4 border rounded-lg transition-colors ${
          selectedType === "employer" 
            ? "border-orange-500 bg-orange-50 text-orange-600" 
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Building2 className="w-5 h-5" />
        <div className="text-left">
          <div className="text-sm text-gray-500">Employer</div>
          <div className="font-medium">Login as an Employer</div>
        </div>
      </button>
    </div>
  )
}

export default UserTypeSelector

