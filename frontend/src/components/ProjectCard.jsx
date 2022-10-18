import Spinner from "./Spinner";
import {useQuery} from "@apollo/client";
import {GET_PROJECTS} from "../queries/projectQueries";

export default function ({project}) {
    const {loading,error,data} = useQuery(GET_PROJECTS);
    if(loading) return <Spinner/>
    if(error) return `Error! ${error.message}`

    return (
        <div className="col-md-6">
         <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">{project.name}</h5>
                    <a className="btn btn-light" href={`/projects/${project.id}`}>View</a>
            </div>
                <p className="small">Status <strong>{project.status}</strong></p>
         </div>
         </div>
        </div>
    )

}