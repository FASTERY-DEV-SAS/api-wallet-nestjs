import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export interface Establishment {
    nombreFantasiaComercial: string;
    tipoEstablecimiento: string;
    direccionCompleta: string;
    estado: string;
    numeroEstablecimiento: string;
}
export interface InformacionFechasContribuyente {
    fechaInicioActividades: string;
    fechaCese: string;
    fechaReinicioActividades: string;
    fechaActualizacion: string;
}
@Entity({ name: 'ruc' })
export class Ruc {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    contribuyenteFantasma: string;

    @Column()
    numeroRucFantasma: string;

    @Column()
    numeroRuc: string;

    @Column()
    razonSocial: string;

    @Column()
    nombreComercial: string;

    @Column()
    estadoPersonaNatural: string;

    @Column()
    estadoSociedad: string;

    @Column()
    claseContribuyente: string;

    @Column()
    obligado: string;

    @Column()
    actividadContribuyente: string;

    @Column({ type: 'json', nullable: true })
    informacionFechasContribuyente: InformacionFechasContribuyente;

    @Column()
    representanteLegal: string;

    @Column()
    agenteRepresentante: string;

    @Column()
    personaSociedad: string;

    @Column()
    subtipoContribuyente: string;

    @Column()
    motivoCancelacion: string;

    @Column()
    motivoSuspension: string;

    @Column({ type: 'json', nullable: true })
    establishments: Establishment[];

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
