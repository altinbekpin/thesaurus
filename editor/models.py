from django.db import models
from django.conf import settings
import rdflib
from rdflib.serializer import Serializer
from rdflib.namespace import RDF, RDFS, OWL
# Create your models here.
class Ontology(models.Model):
    create_date = models.DateTimeField(auto_now=True, verbose_name='Құрылған уақыты')
    name = models.CharField(max_length=200, verbose_name='Атауы')
    language = models.CharField(max_length=50,verbose_name='Тілі')
    text = models.TextField(blank = True, verbose_name='Мәтіні')
    author = models.ForeignKey(settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE)
    def savetofile(self):
        f = open( 'ontology.owl', 'w',encoding='utf-8')
        f.write(self.text)
        f.close()
    def GetJson(self,lang):
        res=''
        self.savetofile()
        g = rdflib.Graph()
        g.load('ontology.owl')
        quest = 'SELECT ?label WHERE { ?subject rdfs:subClassOf ?object . ?subject rdfs:label ?label FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "' + lang + '")) } order by ?label '
        qres = g.query(quest)
        for row in qres:
            res = res + "<br/>&emsp; <a href=\"javascript:DoSubmit('" + row[0] +"');\">" + row[0] + "</a>"
        return res

        
    def __str__(self):
        return '%s' % (self.name)
    class Meta:
        verbose_name = 'Жоба'
        verbose_name_plural = 'Жобалар'


    