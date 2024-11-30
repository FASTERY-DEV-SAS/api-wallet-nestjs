import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'cedula' })
export class Cedula {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    identificacion: string;

    @Column()
    nombreCompleto: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column({ default: "no-email" , nullable: true })
    email: string;

    @Column()
    convenio: string;

    @Column({ nullable: true })
    fechaDefuncion: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
