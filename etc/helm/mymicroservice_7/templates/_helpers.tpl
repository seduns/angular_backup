{{- define "mymicroservice_7.hosts.authserver" -}}
{{- print "https://" (.Values.global.hosts.authserver | replace "[RELEASE_NAME]" .Release.Name) -}}
{{- end -}}
{{- define "mymicroservice_7.hosts.webgateway" -}}
{{- print "https://" (.Values.global.hosts.webgateway | replace "[RELEASE_NAME]" .Release.Name) -}}
{{- end -}}
{{- define "mymicroservice_7.hosts.kibana" -}}
{{- print "https://" (.Values.global.hosts.kibana | replace "[RELEASE_NAME]" .Release.Name) -}}
{{- end -}}
{{- define "mymicroservice_7.hosts.grafana" -}}
{{- print "https://" (.Values.global.hosts.grafana | replace "[RELEASE_NAME]" .Release.Name) -}}
{{- end -}}
{{- define "mymicroservice_7.hosts.angular" -}}
{{- print "https://" (.Values.global.hosts.angular | replace "[RELEASE_NAME]" .Release.Name) -}}
{{- end -}}
