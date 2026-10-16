-- Gerado por scripts/generate-seed.mts — não editar à mão.
insert into public.produtos (slug, nome, tipo, resumo, descricao, parametros, destaques, sob_consulta, imagem_url, ordem, ativo) values
  ('i-stat-1', 'Analisador i-STAT 1', 'analisador', 'Analisador de sangue portátil para testes point-of-care, com resultados em minutos à beira do leito.', 'O i-STAT 1 é um analisador portátil e leve que processa amostras de sangue total em cartuchos de uso único. Com poucas gotas de amostra, entrega resultados em minutos no local do atendimento, sem depender do transporte da amostra até o laboratório central. É compatível com toda a linha de cartuchos i-STAT, o que permite escolher o painel adequado a cada situação.', '{}'::text[], array['Portátil e leve, opera com bateria', 'Amostra de sangue total', 'Poucas gotas de amostra por teste', 'Resultados em minutos', 'Compatível com toda a linha de cartuchos i-STAT']::text[], false, null, 1, true),
  ('cartucho-cg8', 'CG8+', 'cartucho', 'Gasometria, eletrólitos, glicose e hematologia em um único cartucho.', 'Cartucho que combina gases sanguíneos, eletrólitos, glicose e parâmetros hematológicos em um único teste, útil quando é preciso uma visão ampla do paciente com uma só amostra.', array['pH', 'PCO2', 'PO2', 'Sódio (Na)', 'Potássio (K)', 'Cálcio ionizado (iCa)', 'Glicose', 'Hematócrito (Hct)', 'Hemoglobina (Hb, calculada)', 'Parâmetros calculados: HCO3, TCO2, BE, sO2']::text[], array['Painel amplo em uma única amostra', 'Indicado para rotinas de gasometria com eletrólitos']::text[], false, null, 2, true),
  ('cartucho-cg4', 'CG4+', 'cartucho', 'Gasometria com lactato.', 'Cartucho de gases sanguíneos com lactato, utilizado quando a avaliação do equilíbrio ácido-base precisa ser acompanhada da dosagem de lactato.', array['pH', 'PCO2', 'PO2', 'Lactato', 'Parâmetros calculados: HCO3, TCO2, BE, sO2']::text[], array['Gasometria e lactato no mesmo teste', 'Também utilizado em medicina esportiva e veterinária']::text[], false, null, 3, true),
  ('cartucho-ctni', 'cTnI', 'cartucho', 'Troponina I cardíaca à beira do leito.', 'Cartucho para dosagem de troponina I cardíaca (cTnI) no ponto de atendimento, como apoio à avaliação de pacientes com dor torácica, conforme protocolo da instituição.', array['Troponina I cardíaca (cTnI)']::text[], array['Marcador cardíaco no local do atendimento', 'Apoio a protocolos de dor torácica']::text[], false, null, 4, true),
  ('cartucho-chem8', 'Chem8+', 'cartucho', 'Bioquímica, eletrólitos e função renal.', 'Cartucho de química que reúne eletrólitos, glicose, marcadores de função renal e hematologia básica em um único teste.', array['Sódio (Na)', 'Potássio (K)', 'Cloreto (Cl)', 'Cálcio ionizado (iCa)', 'TCO2', 'Glicose', 'Ureia (BUN)', 'Creatinina', 'Hematócrito (Hct)', 'Hemoglobina (Hb, calculada)', 'Ânion gap (calculado)']::text[], array['Eletrólitos e função renal no mesmo cartucho']::text[], true, null, 5, true)
on conflict (slug) do nothing;

insert into public.areas (slug, nome, icone, resumo, cenarios, beneficios, cartuchos, segmentos_clientes, ordem, ativo) values
  ('emergencia', 'Emergência / Pronto-socorro', 'siren', 'Decisões rápidas na chegada de pacientes graves.', array['Triagem rápida de pacientes graves', 'Avaliação de distúrbios ácido-base e eletrolíticos', 'Lactato em suspeita de sepse', 'Troponina I na avaliação da dor torácica']::text[], array['Resultados no próprio setor, sem aguardar o transporte da amostra', 'Um único equipamento para vários painéis de testes', 'Apoio a protocolos institucionais de atendimento']::text[], array['cartucho-cg8', 'cartucho-cg4', 'cartucho-ctni', 'cartucho-chem8']::text[], array['hospitais']::text[], 1, true),
  ('uti-adulto', 'UTI adulto', 'heart-pulse', 'Monitoramento seriado do paciente crítico.', array['Gasometrias seriadas', 'Apoio ao ajuste da ventilação mecânica', 'Controle de eletrólitos e glicemia', 'Lactato no paciente em choque']::text[], array['Acompanhamento frequente no próprio leito', 'Agilidade entre coleta e resultado', 'Reposição programada conforme o consumo da unidade']::text[], array['cartucho-cg8', 'cartucho-cg4']::text[], array['hospitais']::text[], 2, true),
  ('uti-neonatal-pediatria', 'UTI neonatal e pediatria', 'baby', 'Pequeno volume de amostra para pacientes pequenos.', array['Gasometria em recém-nascidos e crianças', 'Controle de eletrólitos com amostras de pequeno volume']::text[], array['Poucas gotas de sangue por teste', 'Menor espoliação sanguínea ao longo da internação', 'Resultados no próprio setor']::text[], array['cartucho-cg8', 'cartucho-cg4']::text[], array['hospitais']::text[], 3, true),
  ('centro-cirurgico-anestesia', 'Centro cirúrgico e anestesia', 'scissors', 'Dados intraoperatórios sem sair da sala.', array['Gasometria e cálcio ionizado intraoperatórios', 'Hemoglobina e hematócrito em cirurgias com sangramento']::text[], array['Análise dentro da sala cirúrgica', 'Equipamento portátil que acompanha a equipe', 'Apoio à tomada de decisão da equipe de anestesia']::text[], array['cartucho-cg8', 'cartucho-cg4']::text[], array['hospitais']::text[], 4, true),
  ('cardiologia-dor-toracica', 'Cardiologia e unidades de dor torácica', 'activity', 'Troponina I à beira do leito.', array['Troponina I à beira do leito para apoiar a avaliação de síndrome coronariana aguda']::text[], array['Marcador cardíaco disponível no ponto de atendimento', 'Apoio a protocolos de dor torácica da instituição']::text[], array['cartucho-ctni']::text[], array['hospitais']::text[], 5, true),
  ('nefrologia-dialise', 'Nefrologia e diálise', 'droplets', 'Eletrólitos e função renal antes e depois das sessões.', array['Eletrólitos, ureia e creatinina antes e após sessões de diálise']::text[], array['Painel renal completo em um único cartucho', 'Resultados na própria unidade de diálise']::text[], array['cartucho-chem8']::text[], array['hospitais']::text[], 6, true),
  ('transporte-remocao', 'Transporte e remoção', 'ambulance', 'Ambulância e aeromédico.', array['Análises durante o transporte em ambulância ou aeronave para apoiar decisões']::text[], array['Analisador portátil, leve e a bateria', 'Mesmos cartuchos usados no hospital']::text[], array['cartucho-cg8', 'cartucho-cg4']::text[], array['hospitais']::text[], 7, true),
  ('veterinaria-pequenos-animais', 'Clínicas e hospitais veterinários', 'paw-print', 'Emergência e cirurgia de pequenos animais.', array['Emergência e cirurgia de pequenos animais', 'Gasometria, eletrólitos e lactato em pacientes críticos']::text[], array['Pequeno volume de amostra', 'Resultados durante o atendimento', 'Reposição programada de cartuchos']::text[], array['cartucho-cg8', 'cartucho-cg4', 'cartucho-chem8']::text[], array['veterinaria']::text[], 8, true),
  ('veterinaria-grandes-animais', 'Grandes animais e equinos', 'tractor', 'Avaliação a campo com equipamento portátil.', array['Avaliação de cólica e desidratação com lactato e eletrólitos', 'Análises a campo, fora da clínica']::text[], array['Equipamento portátil, leve e a bateria', 'Resultados no local do atendimento']::text[], array['cartucho-cg4', 'cartucho-cg8']::text[], array['veterinaria']::text[], 9, true),
  ('medicina-esportiva', 'Medicina esportiva e clubes', 'dumbbell', 'Lactato e hidratação de atletas.', array['Lactato para avaliação de limiar e prescrição de treino', 'Eletrólitos e hidratação em atletas']::text[], array['Análises no local do treino ou do teste', 'Equipamento portátil para o dia a dia do clube']::text[], array['cartucho-cg4', 'cartucho-cg8']::text[], '{}'::text[], 10, true),
  ('reproducao-humana', 'Clínicas de reprodução humana', 'flask-conical', 'Segurança anestésica em procedimentos de captação.', array['Segurança anestésica em procedimentos de captação', 'Apoio ao monitoramento de eletrólitos e hematócrito quando indicado']::text[], array['Resultados dentro da clínica', 'Equipamento compacto para estruturas enxutas']::text[], array['cartucho-cg8']::text[], array['reproducao']::text[], 11, true),
  ('pesquisa-ensino', 'Pesquisa e ensino', 'microscope', 'Análises rápidas em campo e em laboratório.', array['Análises rápidas em campo e em laboratório com equipamento portátil']::text[], array['Portabilidade para expedições e estudos de campo', 'Vários painéis com um único analisador']::text[], array['cartucho-cg8', 'cartucho-cg4', 'cartucho-chem8']::text[], array['pesquisa']::text[], 12, true)
on conflict (slug) do nothing;

do $$ begin if not exists (select 1 from public.clientes) then
insert into public.clientes (logo_url, segmentos_relacionados, unidades, cidade, uf, destaque, ordem, ativo, nome, segmento) values
  (null, array['hospitais']::text[], 'Blumenau, Joinville, Criciúma', null, null, true, 1, true, 'Unimed', 'redes'),
  (null, array['veterinaria']::text[], 'Porto Alegre, Florianópolis, Blumenau, Balneário Camboriú, NiCare, Joinville, Curitiba, São Paulo, Fortaleza', null, null, true, 3, true, 'Vetex', 'redes'),
  (null, '{}'::text[], 'Santo Amaro, Praia do Sonho, Palhoça, Biguaçu', null, null, true, 4, true, 'Gabevida', 'redes'),
  (null, '{}'::text[], null, 'Porto Alegre', 'RS', true, 2, true, 'Hospital de Clínicas de Porto Alegre', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 104, true, 'Hospital São Roque', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 105, true, 'Hospital Nossa Senhora de Fátima', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 106, true, 'Hospital São Judas Tadeu', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 107, true, 'Hospital São Sebastião', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 108, true, 'Hospital Nossa Senhora das Dores', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 109, true, 'Hospital de Ipira', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 110, true, 'Hospital Frei Rogério', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 111, true, 'Hospital Santo Antônio (Tapejara)', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 112, true, 'Hospital São Benedito', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 113, true, 'Hospital de Guarnição', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 114, true, 'Hospital Amparo', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 115, true, 'Hospital BDW (Blanco)', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 116, true, 'Hospital Santo Antônio (Urubici)', 'hospitais'),
  (null, '{}'::text[], null, null, null, false, 117, true, 'Hospital Seara do Bem', 'hospitais'),
  (null, '{}'::text[], null, null, null, true, 8, true, 'Hospital Veterinário Darabas', 'veterinaria'),
  (null, '{}'::text[], null, null, null, false, 119, true, 'Hospital Veterinário Vitá', 'veterinaria'),
  (null, '{}'::text[], null, 'Porto Alegre', 'RS', false, 120, true, 'Centro Veterinário Porto Alegre', 'veterinaria'),
  (null, '{}'::text[], null, 'Porto Alegre', 'RS', false, 121, true, 'Hospital Veterinário Porto Alegre', 'veterinaria'),
  (null, '{}'::text[], null, null, null, false, 122, true, 'Hospital Veterinário Stolf', 'veterinaria'),
  (null, '{}'::text[], null, null, null, false, 123, true, 'VetHouse', 'veterinaria'),
  (null, '{}'::text[], null, null, null, false, 124, true, 'R3 Animal', 'veterinaria'),
  (null, '{}'::text[], null, null, null, true, 5, true, 'Progenese', 'reproducao'),
  (null, '{}'::text[], null, null, null, true, 9, true, 'Clifert', 'reproducao'),
  (null, '{}'::text[], null, null, null, false, 127, true, 'Laboratório de Fertilidade Foz do Iguaçu', 'reproducao'),
  (null, '{}'::text[], null, null, null, true, 6, true, 'Funpar', 'pesquisa'),
  (null, '{}'::text[], null, null, null, false, 129, true, 'Faergs', 'pesquisa'),
  (null, '{}'::text[], null, null, null, true, 7, true, 'Instituto Mamirauá', 'pesquisa'),
  (null, '{}'::text[], null, null, null, true, 10, true, 'Biolab', 'pesquisa'),
  (null, '{}'::text[], null, null, null, false, 132, true, 'Apoiolab', 'pesquisa'),
  (null, '{}'::text[], null, null, null, false, 133, true, 'Instituto Gaia', 'outros'),
  (null, '{}'::text[], null, null, null, false, 134, true, 'Vital Araçatuba', 'outros');
end if; end $$;
