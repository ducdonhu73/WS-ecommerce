echo 'Enter new service name (Lowercase):'
read name

nest g service $name
nest g module $name
nest g controller $name

cd src/
cd $name

rm -rf $name.controller.spec.ts
rm -rf $name.service.spec.ts

mkdir {entities,dto}

cat ../scripts/dto.txt > dto/$name.dto.ts
cat ../scripts/schema.txt > entities/$name.schema.ts 

NC='\033[0m'
IGreen='\033[0;92m'

echo 
echo -e "NOTE: ${IGreen}Drag new service folder to 'resources' folder${NC}"
echo -e "NOTE: ${IGreen}Drag new service folder to 'resources' folder${NC}"
echo -e "NOTE: ${IGreen}Drag new service folder to 'resources' folder${NC}"
echo 

# mv ../$name ../resources/$name
cd ../..