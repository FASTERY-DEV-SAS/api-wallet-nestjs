import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export interface Establishment {
    nombreFantasiaComercial: string;
    tipoEstablecimiento: string;
    direccionCompleta: string;
    estado: string;
    numeroEstablecimiento: string;
}
export interface InformacionFechasContribuyente {
    fechaInicioActividades: string;
    fechaCese: any;
    fechaReinicioActividades: any;
    fechaActualizacion: string;
}
@Entity({ name: 'ruc' })
export class Ruc {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    numeroRuc: string;

    @Column({ default: "no-email" , nullable: true })
    email: string;

    @Column()
    razonSocial: string;

    @Column()
    estadoContribuyenteRuc: string;

    @Column()
    actividadEconomicaPrincipal: string;

    @Column()
    tipoContribuyente: string;

    @Column({ nullable: true })
    regimen: string;

    @Column({ nullable: true })
    categoria: string;

    @Column()
    obligadoLlevarContabilidad: string;

    @Column()
    agenteRetencion: string;

    @Column()
    contribuyenteEspecial: string;

    @Column({ type: 'json', nullable: true })
    informacionFechasContribuyente: InformacionFechasContribuyente;

    @Column({ type: 'json', nullable: true })
    representantesLegales: { identificacion: string; nombre: string }[];

    @Column({ nullable: true })
    motivoCancelacionSuspension: string;

    @Column()
    contribuyenteFantasma: string;

    @Column()
    transaccionesInexistente: string;

    @Column({ type: 'json', nullable: true })
    establecimientos: Establishment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

