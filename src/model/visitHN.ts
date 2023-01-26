import * as knex from 'knex';

export class visitsearchHN {

    constructor () { }

    getAll(db: knex) {
        return db('covid_cluster')
    }

    getByType(db: knex, type: any) {
        return db('covid_cluster').where('cluster_type', type);
    }

    insRec(db: knex, data: any){
        return db('covid_cluster').insert(data);
    }

    delRec(db: knex, data: any){
        return db('covid_cluster').where(data).del();
    }

    updateRec(db: knex, data: any, dataCondition: any){
        return db('covid_cluster').where(dataCondition).update(data);
    }

    updateByID(db: knex, id: any, data: any) {
        return db('covid_cluster').where('cluster_id', id).update(data);
    }



}
