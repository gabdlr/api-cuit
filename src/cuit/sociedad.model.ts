export interface sociedad {
  sociedad: {
    razonSocial: string;
    cuit: string;
    tipoSocietario: string;
    fechaDeContrato: string;
    numeroRegistroLocal: string;
  };
  domicilioFiscal: direccion;
  domicilioLegal: direccion;
  fechaActualizacion: string;
}
interface direccion {
  provincia: string;
  localidad: string;
  domicilio: string;
  pisoDeptoOfi: string;
  codigoPostal: string;
  estadoDeDomicilio: string;
}
