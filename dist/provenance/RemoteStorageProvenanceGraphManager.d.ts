import { ProvenanceGraph } from './ProvenanceGraph';
import { IProvenanceGraphManager } from './provenance';
import { IProvenanceGraphDataDescription } from './ICmd';
import { GraphBase } from '../graph/GraphBase';
export declare class RemoteStorageProvenanceGraphManager implements IProvenanceGraphManager {
    private options;
    constructor(options?: {});
    list(): Promise<IProvenanceGraphDataDescription[]>;
    getGraph(desc: IProvenanceGraphDataDescription): Promise<GraphBase>;
    get(desc: IProvenanceGraphDataDescription): Promise<ProvenanceGraph>;
    delete(desc: IProvenanceGraphDataDescription): Promise<boolean>;
    clone(graph: GraphBase, desc?: any): PromiseLike<ProvenanceGraph>;
    private importImpl;
    import(json: any, desc?: any): PromiseLike<ProvenanceGraph>;
    migrate(graph: ProvenanceGraph, desc?: any): PromiseLike<ProvenanceGraph>;
    edit(graph: ProvenanceGraph | IProvenanceGraphDataDescription, desc?: any): Promise<IProvenanceGraphDataDescription>;
    create(desc?: any): Promise<ProvenanceGraph>;
}
