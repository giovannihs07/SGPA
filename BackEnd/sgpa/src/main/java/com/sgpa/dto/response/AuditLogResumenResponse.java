package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResumenResponse {

    private long eventosHoy;
    private long criticos7Dias;
    private long usuariosUnicos7Dias;
    private long fallidosHoy;
}
